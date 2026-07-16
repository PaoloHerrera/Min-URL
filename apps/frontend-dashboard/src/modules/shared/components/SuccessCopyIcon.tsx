import { CheckCheck, CopyIcon } from 'lucide-react'

export const SuccessCopyIcon = ({ isSuccess }: { isSuccess: boolean }) => {
	return isSuccess ? (
		<CheckCheck className="text-success" size={20} />
	) : (
		<CopyIcon className="text-mariner-600" size={20} />
	)
}
