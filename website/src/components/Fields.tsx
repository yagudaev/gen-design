import clsx from 'clsx'
import { useId } from 'react'

import { cn } from '@/lib/utils'

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm'

function Label({
  id,
  children,
  className,
  ...props
}: {
  id: string
  children: React.ReactNode
  className?: string
} & React.ComponentPropsWithoutRef<'label'>) {
  return (
    <label
      htmlFor={id}
      className={cn('mb-3 block text-sm font-medium text-gray-700', className)}
      {...props}
    >
      {children}
    </label>
  )
}

export function TextField({
  label,
  type = 'text',
  disabled,
  className,
  inputClassName,
  error,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'input'>, 'id'> & {
  label?: string
  error?: string
  inputClassName?: string
}) {
  let id = useId()

  return (
    <div className={className}>
      {label && (
        <Label id={id} className={cn('', error && 'text-red-500')}>
          {label}
        </Label>
      )}
      <input
        id={id}
        type={type}
        disabled={disabled}
        {...props}
        className={cn(
          formClasses,
          inputClassName,
          disabled && 'bg-slate-200 text-slate-500',
          error && 'border-red-500',
        )}
      />
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  )
}

export function TextAreaField({
  label,
  disabled,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'textarea'>, 'id'> & { label: string }) {
  let id = useId()

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <textarea
        id={id}
        disabled={disabled}
        {...props}
        className={cn(
          formClasses,
          'h-32 resize',
          disabled && 'bg-slate-200 text-slate-500',
        )}
      />
    </div>
  )
}

export function SelectField({
  label,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'select'>, 'id'> & { label: string }) {
  let id = useId()

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
    </div>
  )
}
