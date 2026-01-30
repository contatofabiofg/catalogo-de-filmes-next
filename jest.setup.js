import '@testing-library/jest-dom'

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock do framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

// Mock do react-select
jest.mock('react-select', () => {
  return function MockSelect({ onChange, options, placeholder, ...props }) {
    return (
      <select 
        data-testid="react-select" 
        onChange={(e) => onChange({ value: e.target.value, label: e.target.value })}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
})

// Mock do react-loading-skeleton
jest.mock('react-loading-skeleton', () => ({
  __esModule: true,
  default: ({ count, ...props }) => (
    <div data-testid="skeleton" {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} data-testid={`skeleton-${i}`}>Loading...</div>
      ))}
    </div>
  ),
  SkeletonTheme: ({ children }) => <>{children}</>,
}))



// Mock do window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})