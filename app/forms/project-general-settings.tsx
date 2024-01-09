import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type ActionFunctionArgs, json } from '@remix-run/node'
import { useActionData, Form } from '@remix-run/react'
import { Field, TextareaField } from '~/components/forms'
import { Button } from '~/components/ui/button'
import { updateProject } from '~/repository/project.repository.server'
import { useDashboardLoaderData } from '~/routes/_dashboard+/_layout'
import { updateProjectSchema } from '~/schema/project.schema'
import { type ProjectSelect } from '~/types/kysely-schema'
import { db } from '~/utils/db.server'
import { createToastHeaders } from '~/utils/toast.server'
export const projectGeneralSettingsFormId = 'project-general-settings-form'

interface ProjectGeneralSettingsFormProps {
	defaultData: Pick<ProjectSelect, 'description' | 'name'>
}

export async function projectGeneralSettingsFormAction({
	request,
}: ActionFunctionArgs) {
	const formData = await request.formData()

	const submission = parse(formData, { schema: updateProjectSchema })
	if (!submission.value) {
		return json({ status: 'error', submission }, { status: 400 })
	}

	const isUpdated = await updateProject(db, submission.value)

	const toastType = isUpdated ? 'success' : 'error'

	const toastTitle = isUpdated ? 'successfully updated' : 'failed to update'

	return json(
		{ submission },
		{
			headers: await createToastHeaders({
				title: toastTitle,
				type: toastType,
				description: '',
			}),
		},
	)
}

export const ProjectGeneralSettingsForm = ({
	defaultData,
}: ProjectGeneralSettingsFormProps) => {
	const { user } = useDashboardLoaderData()
	const actionData = useActionData<typeof projectGeneralSettingsFormAction>()
	const [form, fields] = useForm({
		id: projectGeneralSettingsFormId,
		constraint: getFieldsetConstraint(updateProjectSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: updateProjectSchema })
		},
		shouldRevalidate: 'onBlur',
	})
	return (
		<Form method="POST" {...form.props}>
			<Field
				labelProps={{ children: 'Name' }}
				inputProps={{
					...conform.input(fields.name),
					defaultValue: defaultData.name,
				}}
				errors={fields.name.errors}
			/>
			<TextareaField
				labelProps={{ children: 'Description' }}
				textareaProps={{
					...conform.input(fields.description),
					...(defaultData.description && {
						defaultValue: defaultData.description,
					}),
				}}
				errors={fields.description.errors}
			/>
			<input
				type="hidden"
				value={user.workspaceId}
				name={fields.workspaceId.name}
			/>
			<Button type="submit">Save</Button>
		</Form>
	)
}
