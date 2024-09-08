import { LabelDisplayedRowsArgs } from '@mui/material';
import i18n from '../i18n';

export const labelDisplayedRows = (
	args: LabelDisplayedRowsArgs & {
		estimated?: number;
	}
) => {
	const { t } = i18n;
	const { from, to, count, estimated } = args;
	if (!estimated) {
		return `${from}–${to} ${t('commons.pagination.of')} ${
			count !== -1 ? count : `${t('commons.pagination.moreThan')} ${to}`
		}`;
	}
	return `${from}–${to} ${t('commons.pagination.of')} ${
		count !== -1
			? count
			: `${t('commons.pagination.moreThan')} ${estimated > to ? estimated : to}`
	}`;
};

export const labelRowsPerPage = () => {
	const { t } = i18n;
	return t('commons.pagination.rowsPerPage');
};
