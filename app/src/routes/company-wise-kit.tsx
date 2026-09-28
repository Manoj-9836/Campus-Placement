import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company-wise-kit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/company-wise-kit"!</div>
}
