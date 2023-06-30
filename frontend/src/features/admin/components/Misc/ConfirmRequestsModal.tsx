import Modal from '@/shared/components/Elements/Modal';
import { format } from 'date-fns';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAcceptRegisterRequests } from '../../api/acceptRegisterRequests';
import { useRegisterRequests } from '../../api/getRegisterRequests';

type ConfirmRequestsModalProps = {
  isOpen: boolean;
  close: () => void;
};

interface ConfirmRequestsModalInput {
  accepts: string;
}

const ConfirmRequestsModal = ({ isOpen, close }: ConfirmRequestsModalProps) => {
  const registerRequests = useRegisterRequests();
  const acceptRequestMutation = useAcceptRegisterRequests();
  const requests = registerRequests.data?.requests || [];

  const { control, getValues, setValue } = useForm<ConfirmRequestsModalInput>({
    defaultValues: {
      accepts: '',
    },
  });

  const handleCheck = (request: { email: string }, event: React.ChangeEvent<{}>) => {
    const values = (getValues('accepts')?.split(',') || []).filter((v) => v);
    const newValues = (() => {
      if ((event.target as HTMLInputElement).checked) {
        return [...(values ?? []), request.email];
      }
      return values?.filter((value) => value !== request.email);
    })();
    setValue('accepts', newValues.join(','));

    return newValues.join(',');
  };

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      const all = requests.map((request) => request.email).join(',');
      setValue('accepts', all);
    } else {
      setValue('accepts', '');
    }
  };

  const onSubmit = async () => {
    const accepts = getValues('accepts');
    const submitData = accepts.split(',').map((email) => {
      const formData = new FormData();
      formData.append('email', email);
      return formData;
    });
    await acceptRequestMutation.mutateAsync({ formData: submitData });
  };

  return (
    <Modal isOpen={isOpen} title="登録申請" buttonTxt="承認" go={onSubmit} close={close}>
      <div>
        <div className="form-control">
          <label className="w-min space-x-6 label cursor-pointer">
            <input type="checkbox" className="checkbox" onChange={handleCheckAll} />
            <span className="label-text text-lg">All</span>
          </label>
        </div>
        <Controller
          name="accepts"
          control={control}
          rules={{ required: '選択してください。' }}
          render={() => (
            <>
              {requests.map((request) => (
                <div className="form-control" key={request.id}>
                  <label className="w-min whitespace-nowrap space-x-6 label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={getValues('accepts').split(',').includes(request.email)}
                      onChange={(e) => handleCheck({ email: request.email }, e)}
                    />
                    <span className="label-text text-lg">{request.name}</span>
                    <span className="label-text text-xs">
                      申請日 : {format(new Date(request.created_at), 'yyyy年MM月dd日')}
                    </span>
                  </label>
                </div>
              ))}
            </>
          )}
        />
      </div>
    </Modal>
  );
};

export default React.memo(ConfirmRequestsModal);
