import { useUsers } from '@/features/auth/api/getUsers';
import { useCreateReview } from '@/features/reviews/api/reviews/createReview';
import Modal from '@/shared/components/Elements/Modal';
import { useForm } from 'react-hook-form';

type RegisterModalProps = {
  isOpen: boolean;
  close: () => void;
};

interface RegisterInputs {
  event: string;
  grade: number;
  students: string[];
}

const RegisterModal = ({ isOpen, close }: RegisterModalProps) => {
  const usersQuery = useUsers();
  const users = usersQuery.data || [];
  const createReviewMutation = useCreateReview();
  const { register, getValues, watch } = useForm<RegisterInputs>({
    defaultValues: {
      event: '',
      grade: 2,
      students: [],
    },
  });

  const onSubmit = async () => {
    const event = getValues('event');
    const grade = parseInt(getValues('grade').toString());
    const students = getValues('students');
    if (!event.trim() || !(grade >= 2 && grade <= 6) || (grade === 6 && students.length === 0)) {
      alert('未入力の項目があります');
      return;
    }
    const formData = new FormData();
    if (grade === 6 && students.length > 0) {
      formData.append('userIds', students.join(','));
    }
    formData.append('reviewName', event);
    formData.append('targetGrade', String(grade));
    await createReviewMutation.mutateAsync({ formData });
    close();
  };

  return (
    <Modal title="新規イベント作成" buttonTxt="作成" isOpen={isOpen} close={close} go={onSubmit}>
      <input
        id="name"
        type="text"
        placeholder="イベント名"
        className="input input-bordered w-full my-2"
        {...register('event')}
      />
      <select id="grade" className="select select-bordered w-full my-2" {...register('grade')}>
        <option value="" disabled>
          対象学年を選択
        </option>
        <option value={2}>学士3年</option>
        <option value={3}>学士4年</option>
        <option value={4}>修士1年</option>
        <option value={5}>修士2年</option>
        <option value={6}>カスタム</option>
      </select>
      {parseInt(watch('grade').toString()) === 6 && (
        <div className="my-2 w-full">
          <span className="text-sm">対象者を選択</span>
          <div className="w-full h-28 overflow-y-scroll border rounded-md grid grid-cols-2 gap-4">
            {users.map((u) => (
              <div key={u.id} className="form-control">
                <label className="label cursor-pointer group">
                  <span className="label-text group-hover:text-gray-400">{u.name}</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    value={u.id}
                    {...register('students')}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RegisterModal;
