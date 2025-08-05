import clsx from 'clsx'

export function PageBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <main className="pb-12 grow">
      <div
        className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
        {...props}
      />
    </main>
  )
}
