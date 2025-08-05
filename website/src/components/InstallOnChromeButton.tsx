import { ChromeIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function Component() {
  return (
    <Button
      variant="default"
      className="text-white border-gray-300 hover:cursor-default hover:bg-primary/90"
    >
      <a
        href="https://chromewebstore.google.com/detail/audiowaveai/ceabbcjppnfgjkjcbdakaniaigkomgnb"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 !text-white !no-underline "
      >
        <ChromeIcon className="w-5 h-5" />
        <span>Install on Chrome</span>
      </a>
    </Button>
  )
}
