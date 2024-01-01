import { CreateProjectForm, createProjectFormId } from '~/forms/create-project'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogHeader,
	DialogClose,
	DialogFooter,
} from '../ui/dialog'
import { Icon } from '../ui/icon'

export function CreateProjectDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm" className="flex items-center gap-x-2">
					<Icon name="plus" />
					New project
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New project</DialogTitle>
				</DialogHeader>
				<CreateProjectForm />
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary" type="button">
							Cancel
						</Button>
					</DialogClose>
					<Button form={createProjectFormId} type="submit">
						Create project
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
