import React, {useEffect, useState} from 'react';
import {PropsPopupUpdateAccount} from './interfaces';
import styles from './PopupUpdateAccount.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {FormContext, Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import regencyServices from '~/services/regencyServices';
import AvatarChange from '~/components/common/AvatarChange';

function PopupUpdateAccount({dataUpdateAccount, onClose}: PropsPopupUpdateAccount) {
	const [form, setForm] = useState<{
		avatar: string;
		userUuid: string;
		fullName: string;
		userName: string;
		regencyUuid: string;
	}>({avatar: '', userUuid: '', fullName: '', userName: '', regencyUuid: ''});

	const [file, setFile] = useState<any>(null);

	const listRegency = useQuery([QUERY_KEY.dropdown_chuc_vu], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: regencyServices.listRegency({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	useEffect(() => {
		setForm({
			avatar: dataUpdateAccount?.user?.linkImage || '',
			userUuid: dataUpdateAccount?.uuid || '',
			fullName: dataUpdateAccount?.user?.fullName || '',
			userName: dataUpdateAccount?.username || '',
			regencyUuid: dataUpdateAccount?.user?.regencyUu?.uuid || '',
		});
	}, [dataUpdateAccount]);

	const handleSubmit = async () => {
		if (!form?.regencyUuid) {
			return toastWarn({msg: 'Vui lòng chọn chức vụ'});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={false} />
			<h4>Chỉnh sửa tài khoản</h4>
			<p className={styles.p}>Điền đầy đủ thông tin cân thiết</p>
			<Form form={form} setForm={setForm}>
				{/* <div className={'mt'}>
					<AvatarChange path='' name='avatar' onSetFile={(file) => setFile(file)} />
				</div> */}
				<div className={'mt'}>
					<Input
						readOnly
						type='text'
						placeholder='Nhập tên nhân viên'
						name='fullName'
						value={form.fullName}
						label={<span>Tên nhân viên</span>}
					/>{' '}
				</div>
				<div className={'mt'}>
					<Input
						readOnly
						type='text'
						placeholder='Nhập tên tài khoản'
						name='userName'
						value={form.userName}
						label={<span>Tên tài khoản</span>}
					/>
				</div>

				<div className={'mt'}>
					<Select
						isSearch
						name='regencyUuid'
						value={form.regencyUuid || null}
						placeholder='Lựa chọn'
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								regencyUuid: e.target.value,
							}))
						}
						label={
							<span>
								Vai trò<span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listRegency?.data?.map((v: any) => (
							<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
						))}
					</Select>
				</div>

				<div className={styles.groupBtnPopup}>
					<Button p_10_24 rounded_6 grey_outline onClick={onClose} maxContent>
						Hủy bỏ
					</Button>

					<FormContext.Consumer>
						{({isDone}) => (
							<Button disable={!isDone} p_10_24 rounded_6 primary onClick={handleSubmit} maxContent>
								Xác nhận
							</Button>
						)}
					</FormContext.Consumer>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default PopupUpdateAccount;
