import { UserContext } from '@/features/auth/modules/contexts/user';
import { useRename } from '@/features/home/api/profile/rename';
import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface UserNameInput {
  name: string;
}

const UserName = () => {
  const user = useContext(UserContext);
  const renameMutation = useRename();
  const { handleSubmit, register, setValue, watch } = useForm<UserNameInput>({
    defaultValues: {
      name: user?.name,
    },
  });

  const cancel = () => {
    if (user) {
      setValue('name', user.name);
    }
  };

  const onSubmit: SubmitHandler<UserNameInput> = ({ name }) => {
    const param = new URLSearchParams();
    param.append('newName', name);
    renameMutation.mutateAsync({ param });
  };

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
    }
  }, [user]);

  return (
    <div className="card w-96 bg-base-100 shadow-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="card-body">
        <h2 className="card-title">ユーザ名</h2>
        <input
          id="name"
          className="input input-bordered w-full w-xs my-2"
          {...register('name')}
        ></input>
        <div className="card-actions justify-end">
          {user?.name !== watch('name') && (
            <button onClick={cancel} className="btn btn-primary btn-ghost">
              キャンセル
            </button>
          )}
          <button disabled={user?.name === watch('name')} className="btn btn-primary">
            変更
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserName;
