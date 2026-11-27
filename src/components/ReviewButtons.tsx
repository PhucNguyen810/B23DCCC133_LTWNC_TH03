import { moderatePost } from '@/app/(member)/admin/actions';

export default function ReviewButtons({ id }: { id: number }) {
  const approve = moderatePost.bind(null, id, 'approved');
  const hide = moderatePost.bind(null, id, 'hidden');
  return (
    <div className="review-actions">
      <form action={approve}><button type="submit">Duyệt</button></form>
      <form action={hide}><button type="submit">Ẩn</button></form>
    </div>
  );
}
