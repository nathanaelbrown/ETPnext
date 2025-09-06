import type {PortableTextComponents} from '@portabletext/react'

export const ptComponents: PortableTextComponents = {
  block: {
    h2: ({children}) => <h2 className="mt-10 text-2xl font-semibold tracking-tight">{children}</h2>,
    h3: ({children}) => <h3 className="mt-8 text-xl font-semibold">{children}</h3>,
    blockquote: ({children}) => (
      <blockquote className="mt-6 border-l-4 pl-4 italic text-neutral-700">{children}</blockquote>
    ),
    normal: ({children}) => <p className="mt-4 leading-7">{children}</p>,
  },
  list: {
    bullet: ({children}) => <ul className="mt-4 list-disc pl-6 space-y-2">{children}</ul>,
    number: ({children}) => <ol className="mt-4 list-decimal pl-6 space-y-2">{children}</ol>,
  },
  marks: {
    link: ({value, children}) => (
      <a href={value?.href} className="underline underline-offset-4 hover:text-blue-700" target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  },
}
