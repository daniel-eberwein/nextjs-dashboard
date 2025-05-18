import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { Metadata } from "next";
import CreateCustomerForm from "@/app/ui/customers/create-form";

export const metadata: Metadata = {
    title: 'Create Invoice'
  }

export default async function CreateCustomer() {

    return (

        <main>
            <Breadcrumbs 
                breadcrumbs={[
                    {label: 'Customers', href: '/dashboard/customers'},
                    {label: 'Create Customer', href: '/dashboard/customers/create', active: true},
                ]}
            />
            {/* <Form customers={customers} /> */}
            <CreateCustomerForm />
        </main>

    )
}