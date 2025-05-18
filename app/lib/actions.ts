'use server'

import { z } from 'zod'
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.'
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.' }),
    date: z.string()
});

const CustomerFormSchema = z.object({
    id: z.string(),
    name: z.string().nonempty({ message: 'Please enter a name.' }),
    email: z.string().email({ message: 'Please enter a valid email' }),
    image_url: z.string().url({ message: 'Please enter valid URL to an image' }),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateCustomer = CustomerFormSchema.omit({ id: true, image_url: true });
const CreateCustomer = CustomerFormSchema.omit({ id: true });

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid Credentials';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}

export type CustomerState = {
    errors?: {
        name?: string[];
        email?: string[];
        image_url?: string[];
    };
    message?: string | null;
}

export async function createInvoice(prevState: State, formData: FormData) {

    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.'
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    } catch (error) {
        console.error(error);
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard');
    redirect('/dashboard/invoices');

}
export async function createCustomer(prevState: CustomerState, formData: FormData) {

    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url'),
    });

    console.log(validatedFields.data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Customer.'
        };
    }

    const { name, email, image_url } = validatedFields.data;

    try {
        await sql`
    INSERT INTO customers (name, email, image_url)
    VALUES (${name}, ${email}, ${image_url})
    `;
    } catch (error) {
        console.error(error);
        return {
            message: 'Database Error: Failed to Create Customer.',
        };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');

}


export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.'
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;

    } catch (error) {
        console.error(error);
        return { message: 'Database Error. Failed to Update Invoice.' };
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function updateCustomer(id: string, prevState: CustomerState, formData: FormData) {
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        //image_url: formData.get('image_url'),
    });

    console.log(validatedFields.data);
    console.log(validatedFields.success);

    if (!validatedFields.success) {
        console.log("Melde Fehler zurück...");
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.'
        };
    }

    const { name, email } = validatedFields.data;

    try {
        await sql`
          UPDATE customers
          SET name = ${name}, email = ${email}
          WHERE id = ${id}
        `;

    } catch (error) {
        console.error(error);
        return { message: 'Database Error. Failed to Update Customer.' };
    }
    revalidatePath('/dashboard/customers');
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/customers');

}


export async function deleteInvoice(id: string) {

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error) {
        console.log(error);
    }

    revalidatePath('/dashboard/invoices');
}