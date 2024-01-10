import { Form } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export function LoginForm() {
	return (
		<Form action="/login" method="post" className="flex flex-col gap-y-6">
			<Label className="sr-only" htmlFor="email">
				Email
			</Label>
			<Input
				id="email"
				type="email"
				name="email"
				required
				placeholder="name@example.com"
			/>
			<Button>Sign In with Email</Button>
		</Form>
	)
}
