import { FormComponent } from '@/components/forms/FormComponent'
import HowItWork from '../howitwork/HowItWork'

export default function HomePage() {
	return (
		<main className="flex flex-col items-center">
			<FormComponent />

			<HowItWork />
		</main>
	)
}
