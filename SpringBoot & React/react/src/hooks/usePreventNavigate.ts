import React, { useCallback } from 'react';
import { useNavigate, NavigateOptions } from 'react-router';

export const usePreventNavigate = (to: string, options?: NavigateOptions | undefined) => {
	const navigate = useNavigate();
	
	return useCallback((event?: React.FormEvent | React.KeyboardEvent | React.MouseEvent | React.ChangeEvent) => {
		event?.preventDefault();

		navigate(to, options);
	}, [navigate, to, options]);
};