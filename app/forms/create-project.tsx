import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'

import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useActionData, Form } from '@remix-run/react'

import { Field, TextareaField } from '~/components/forms'
import { createProject } from '~/repository/project.repository.server'
import { useDashboardLoaderData } from '~/routes/_dashboard+/_layout'
import { createProjectSchema } from '~/schema/project.schema'
import { db } from '~/utils/db.server'
import { createToastHeaders } from '~/utils/toast.server'

export async function createProjectFormAction({ request }: ActionFunctionArgs) {
	const formData = await request.formData()

	const submission = parse(formData, { schema: createProjectSchema })
	if (!submission.value) {
		return json({ status: 'error', submission }, { status: 400 })
	}

	await createProject(db, submission.value)

	return json(
		{ submission },
		{
			headers: await createToastHeaders({
				title: 'successfully created project',
				type: 'success',
				description: '',
			}),
		},
	)
}

export const createProjectFormId = 'create-project-form'

export function CreateProjectForm() {
	const { user } = useDashboardLoaderData()
	const actionData = useActionData<typeof createProjectFormAction>()
	const [form, fields] = useForm({
		id: createProjectFormId,
		constraint: getFieldsetConstraint(createProjectSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: createProjectSchema })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<Form method="POST" {...form.props}>
			<Field
				labelProps={{ children: 'Name' }}
				inputProps={{
					...conform.input(fields.name),
				}}
				errors={fields.name.errors}
			/>
			<TextareaField
				labelProps={{ children: 'Description' }}
				textareaProps={{
					...conform.input(fields.description),
				}}
				errors={fields.description.errors}
			/>
			<input
				type="hidden"
				value={user.workspaceId}
				name={fields.workspaceId.name}
			/>
		</Form>
	)
}
