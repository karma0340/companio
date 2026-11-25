import { redirect } from 'next/navigation';

export default function DeprecatedHostKycRedirect() {
  redirect('/become-a-companion/apply');
}
