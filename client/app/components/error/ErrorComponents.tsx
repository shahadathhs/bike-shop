import { Link } from 'react-router'

const ErrorComponents = ({
  message,
  details,
  status,
}: {
  message: string | null
  details: string | null
  status: number | null
}) => {
  return (
    <section className="h-screen w-full flex flex-col justify-center items-center">
      <p className="text-[#FF4D4D] text-lg font-bold font-geist text-center">{status ?? 404}</p>
      <p className="max-w-[550px] text-center text-black-text font-figtree text-[35px] mt-[30px] font-normal">
        {message ?? 'Oops! It Looks Like The Page You’re Looking For Isn’t Available.'}
      </p>
      <p className="text-tertiary-text mb-[30px] text-lg font-normal leading-[28px] font-geist mt-[30px]">
        {details ?? 'It might have been moved or doesn‘t exist anymore.'}
      </p>
      <Link to="/" className="mt-[30px] btn btn-primary">
        BACK TO HOME
      </Link>
    </section>
  )
}
export default ErrorComponents
