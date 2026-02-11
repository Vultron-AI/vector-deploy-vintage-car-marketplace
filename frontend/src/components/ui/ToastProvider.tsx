/**
 * Toast Provider and Hook
 *
 * Provides toast state management and a hook for showing toasts.
 *
 * Usage:
 *   // In App.tsx, wrap your app with Toaster:
 *   <ToastContextProvider>
 *     <App />
 *     <Toaster />
 *   </ToastContextProvider>
 *
 *   // In any component:
 *   const { toast } = useToast()
 *   toast({ title: 'Success!', variant: 'success' })
 */

import * as React from 'react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './Toast'
import type { ToastProps } from './Toast'

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

type ToastState = {
  toasts: ToasterToast[]
}

type ToastAction =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string }

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function addToRemoveQueue(toastId: string, dispatch: React.Dispatch<ToastAction>) {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

function reducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }
    }

    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return { ...state, toasts: [] }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }

    default:
      return state
  }
}

type ToastContextType = {
  toasts: ToasterToast[]
  toast: (props: Omit<ToasterToast, 'id'>) => { id: string; dismiss: () => void }
  dismiss: (toastId?: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] })

  const toast = React.useCallback(
    (props: Omit<ToasterToast, 'id'>) => {
      const id = genId()

      const newToast: ToasterToast = {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) {
            dispatch({ type: 'DISMISS_TOAST', toastId: id })
            addToRemoveQueue(id, dispatch)
          }
        },
      }

      dispatch({ type: 'ADD_TOAST', toast: newToast })

      // Auto dismiss after delay
      setTimeout(() => {
        dispatch({ type: 'DISMISS_TOAST', toastId: id })
        addToRemoveQueue(id, dispatch)
      }, TOAST_REMOVE_DELAY)

      return {
        id,
        dismiss: () => dispatch({ type: 'DISMISS_TOAST', toastId: id }),
      }
    },
    []
  )

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({ type: 'DISMISS_TOAST', toastId })
  }, [])

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastContextProvider')
  }
  return context
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
