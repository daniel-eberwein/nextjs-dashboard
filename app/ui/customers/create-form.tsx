'use client'

import Link from 'next/link';
import {
  ChatBubbleBottomCenterTextIcon,
  UserCircleIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCustomer, CustomerState } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function CreateCustomerForm() {

  const initialState: CustomerState = {
    message: null,
    errors: {}
  };
  const [state, formAction] = useActionState(createCustomer, initialState);

  return (
    <form action={formAction} aria-describedby='form-error'>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={""}
                placeholder="Enter customer name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='name-error'
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id='name-error' aria-atomic='true' aria-live='polite'>
            {state.errors?.name && state.errors.name.map((error: string) => (
              <p key={error} className='mt-2 text-sm text-red-500'>{error}</p>
            ))}
          </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Customer Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={""}
                placeholder="Enter customer email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='email-error'
              />
              <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id='email-error' aria-atomic='true' aria-live='polite'>
            {state.errors?.email && state.errors.email.map((error: string) => (
              <p key={error} className='mt-2 text-sm text-red-500'>{error}</p>
            ))}
          </div>
        </div>

        {/* Customer Image */}
        <div className='mb-4'>
          <label htmlFor='image_url' className='mb-2 block text-sm font-medium'>
            Customer Image
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input 
                id='image_url' 
                name='image_url' 
                type='url'
                // accept='image/png, image/jpeg' 
                // placeholder='Upload customer image' 
                placeholder='Enter Image URL'
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                aria-describedby='image-error' 
              />
              <CameraIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
            </div>
          </div>
          <div id='image-error' aria-atomic='true' aria-live='polite'>
            {state.errors?.image_url && state.errors.image_url.map((error: string) => (
              <p key={error} className='mt-2 text-sm text-red-500'>{error}</p>
            ))}
          </div>
        </div>

        <div id='form-error' aria-atomic='true' aria-live='polite'>
          {state.errors != null && state.message != null ? (
            <p className='mt-2 text-sm text-red-500'>{state.message}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}
