import Logo from '@/assets/images/Logo-MinURL.webp'
import LoginImage from '@/assets/images/login.webp'
import type { RegisterCardProps } from '@/types'

export const RegisterCard = ({ information }: RegisterCardProps) => {
	return (
		<div className="container flex justify-center items-center px-4 lg:px-0 py-10">
			<div className="card lg:card-side shadow-2xl rounded-4xl w-full flex-col-reverse lg:flex-row border-4 border-brand-400 min-h-[750px] max-w-[1024px] h-auto">
				<div className="card-body lg:w-1/2 lg:h-auto items-center gap-6">
					<figure className="flex items-center flex-col">
						<img src={Logo} alt="Logo MinURL" className="w-12" />
						<div className="font-bold text-xl text-center">Min-URL</div>
					</figure>

					<div className="flex items-center flex-col gap-6">
						<h2 className="card-title text-4xl">
							{' '}
							{information.title}{' '}
							<span className="text-brand-200">
								{' '}
								{information.titleSufix}
							</span>{' '}
						</h2>
						<p className="text-xs"> {information.description} </p>
					</div>
					<form action="" className="w-full flex flex-col gap-6">
						<div className="flex gap-6 flex-col lg:flex-row w-full">
							<div className="w-1/2">
								<label className="input validator w-full rounded-4xl">
									<svg
										className="h-[1em] opacity-50"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<title>User icon</title>
										<g
											strokeLinejoin="round"
											strokeLinecap="round"
											strokeWidth="2.5"
											fill="none"
											stroke="currentColor"
										>
											<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
											<circle cx="12" cy="7" r="4" />
										</g>
									</svg>
									<input
										type="text"
										required={true}
										placeholder={information.fullNamePlaceholder}
										pattern="[A-Za-z ]*"
										minLength={3}
										maxLength={30}
										title="Only letters"
									/>
								</label>
								<p className="validator-hint hidden">
									{information.fullNameValidatorHint}
								</p>
							</div>
							<div className="w-1/2">
								<label className="input validator w-full rounded-4xl">
									<svg
										className="h-[1em] opacity-50"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<title>Email icon</title>
										<g
											strokeLinejoin="round"
											strokeLinecap="round"
											strokeWidth="2.5"
											fill="none"
											stroke="currentColor"
										>
											<rect width="20" height="16" x="2" y="4" rx="2" />
											<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
										</g>
									</svg>
									<input
										type="email"
										placeholder={information.emailPlaceholder}
										required={true}
									/>
								</label>
								<p className="validator-hint hidden">
									{information.emailValidatorHint}
								</p>
							</div>
						</div>

						<div className="flex gap-6 flex-col lg:flex-row w-full">
							<div className="w-1/2">
								<label className="input validator w-full rounded-4xl">
									<svg
										className="h-[1em] opacity-50"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<title>Password icon</title>
										<g
											strokeLinejoin="round"
											strokeLinecap="round"
											strokeWidth="2.5"
											fill="none"
											stroke="currentColor"
										>
											<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
											<circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
										</g>
									</svg>
									<input
										type="password"
										required={true}
										placeholder={information.passwordPlaceholder}
										minLength={8}
										pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
										title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
									/>
								</label>
								<p className="validator-hint hidden">
									{information.passwordValidatorHint}
								</p>
							</div>
							<div className="w-1/2">
								<label className="input validator w-full rounded-4xl">
									<svg
										className="h-[1em] opacity-50"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<title>Password icon</title>
										<g
											strokeLinejoin="round"
											strokeLinecap="round"
											strokeWidth="2.5"
											fill="none"
											stroke="currentColor"
										>
											<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
											<circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
										</g>
									</svg>
									<input
										type="password"
										required={true}
										placeholder={information.confirmPasswordPlaceholder}
										minLength={8}
										pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
										title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
									/>
								</label>
								<p className="validator-hint hidden">
									{information.confirmPasswordValidatorHint}
								</p>
							</div>
						</div>

						<div />

						<button
							className="btn bg-brand-400 w-full rounded-4xl hover:bg-brand-500"
							type="submit"
						>
							{information.signUpButton}
						</button>
						<div>
							<label className="label">
								<input
									type="checkbox"
									defaultChecked={false}
									className="checkbox bg-white text-black checkbox-xs"
								/>
								<span className="text-xs text-white">
									{information.termsCheckboxText1}
									<a href="/terms" className="link text-brand-200">
										{information.termsLink}
									</a>
									{information.termsCheckboxText2}
									<a href="/privacy" className="link text-brand-200">
										{information.privacyLink}
									</a>
								</span>
							</label>
						</div>
					</form>
					<div className="divider text-xs">{information.dividerText}</div>
					<button
						className="btn bg-white text-black border-[#e5e5e5] w-full rounded-4xl"
						type="button"
					>
						<svg
							aria-label="Google logo"
							width="16"
							height="16"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
						>
							<title>Google icon</title>
							<g>
								<path d="m0 0H512V512H0" fill="#fff" />
								<path
									fill="#34a853"
									d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
								/>
								<path
									fill="#4285f4"
									d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
								/>
								<path
									fill="#fbbc02"
									d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
								/>
								<path
									fill="#ea4335"
									d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
								/>
							</g>
						</svg>
						<span className="text-xs"> {information.googleSignUp} </span>
					</button>
					<p className="text-xs">
						{information.hasAccount}{' '}
						<a href="/login" className="link link-hover text-brand-200">
							{information.loginLink}
						</a>
					</p>
					<footer className="flex w-full justify-center items-center">
						<span className="text-[10px]">
							© {new Date().getFullYear()} Min-URL.{' '}
							{information.allRightsReserved}
						</span>
					</footer>
				</div>
				<figure className="lg:w-1/2 hidden lg:block">
					<img
						src={LoginImage}
						alt="Two men sharing a laptop screen, in representation of Min-URL registration page"
						className="w-full h-full object-cover rounded-tr-xl lg:rounded-br-xl rounded-tl-xl rounded-br-none rounded-bl-none lg:rounded-tl-none"
					/>
				</figure>
			</div>
		</div>
	)
}
