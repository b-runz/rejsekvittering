import { checkCookie, cookiefyString } from '@/lib/RejseplanRequest';
import ReceiptParentView from './ReceiptParentView'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  if (!cookieStore.has('rklogin')) {
    redirect('/')
  } else{
    const cookieValue = cookieStore.get('rklogin')?.value ?? ''
    const cookie = await cookiefyString(cookieValue)
    const cookieValid = await checkCookie(cookie)
    if (!cookieValid) {
        return redirect('/')
    }
  }

  return (
    <div className="w-full bg-gray-100" style={{ zIndex: 4 }}>
      <ReceiptParentView></ReceiptParentView>
    </div>
  );
}