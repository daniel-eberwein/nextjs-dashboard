import EditCustomerForm from "@/app/ui/customers/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { fetchCustomerById } from "@/app/lib/data"
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Edit Customer'
  }

export default async function Page(props: {params: Promise<{id: string}>}) {

    const params = await props.params;
    const id = params.id;

    const customer = await fetchCustomerById(id);

    if (!customer) {
        notFound();
    }

    return (

        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/dashboard/customers' },
                    {
                        label: 'Edit Customer',
                        href: `/dashboard/customers/${id}/edit`,
                        active: true,
                    },
                ]} />
            {/* <Form invoice={invoice} customers={customers} /> */}
            {/* <p>{JSON.stringify(customer)}</p> */}
            {/* <p>{customer.name}</p>
            <p>{customer.email}</p>
            <p>{customer.image_url}</p> */}
            <EditCustomerForm customer={customer} />
        </main>

    )

}