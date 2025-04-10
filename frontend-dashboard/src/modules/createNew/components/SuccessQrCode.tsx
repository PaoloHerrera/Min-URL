import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/modules/core/ui/alert-dialog.tsx'
import { QrPreview } from './QrPreview.tsx'
import { useNewQrCodeStore } from '@/stores/newQrCodeStore.ts'
import { DownloadIcon } from 'lucide-react'
import { downloadQrCode } from '@/lib/downloadQrCode.ts'

export const SuccessQrCode = () => {
	const { newQrCode, setNewQrCode } = useNewQrCodeStore()

	return (
		<AlertDialog open={!!newQrCode} onOpenChange={() => setNewQrCode(null)}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>QR Code Created Successfully!</AlertDialogTitle>
					<AlertDialogDescription>
						Your QR Code is ready to use and share.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex flex-col items-center">
					<QrPreview
						id={newQrCode?.slug}
						foregroundColor={newQrCode?.foregroundColor || '#000000'}
						backgroundColor={newQrCode?.backgroundColor || '#FFFFFF'}
						value={newQrCode?.shortUrl}
						size={200}
					/>
					<div className="mt-5">
						<button
							type="button"
							className="text-mariner-950 bg-transparent rounded-lg flex items-center cursor-pointer gap-5 hover:bg-mariner-50 text-sm py-2 px-3 border border-mariner-200 font-semibold"
							onClick={() =>
								downloadQrCode(
									newQrCode?.title as string,
									newQrCode?.slug as string,
								)
							}
						>
							<DownloadIcon className="text-mariner-950" size={20} />
							Download
						</button>
					</div>

					<div className="w-full bg-mariner-50 border-mariner-200 rounded-md mt-5 p-4 shadow-sm flex flex-col gap-2">
						<h3 className="text-mariner-950 opacity-50 text-sm font-semibold">
							QR Code Information
						</h3>
						<div className="flex flex-row items-center gap-2">
							<div className="flex-1 gap-1">
								<span className="text-mariner-950 text-sm font-semibold">
									Title:{' '}
								</span>
								<span className="text-mariner-500 text-sm font-semibold">
									{newQrCode?.title}
								</span>
							</div>
							<div className="flex-1">
								<span className="text-mariner-950 text-sm font-semibold">
									Scans:{' '}
								</span>
								<span className="text-mariner-950 text-sm font-semibold">
									0
								</span>
							</div>
						</div>
						<div className="flex flex-row items-center gap-2">
							<div className="flex-1">
								<span className="text-mariner-950 text-sm font-semibold">
									Status:{' '}
								</span>
								<span className="text-success text-sm font-semibold">
									Active
								</span>
							</div>
							<div className="flex-1">
								<span className="text-mariner-950 text-sm font-semibold">
									Expires:{' '}
								</span>
								<span className="text-mariner-950 text-sm font-semibold">
									Never
								</span>
							</div>
						</div>
					</div>
				</div>
				<AlertDialogFooter>
					<AlertDialogAction className="w-fit rounded-md bg-mariner-600 px-4 py-2 text-white hover:bg-mariner-700 cursor-pointer">
						Done
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
