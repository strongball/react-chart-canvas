import { Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';

export interface FormData {
    stockCode: string;
}
export type ErrorMessage<T extends {}> = {
    [K in keyof T]?: string;
};
interface Props {
    initValue?: Partial<FormData>;
    onSubmit?: (data: FormData) => void;
}
const StockForm: React.FC<Props> = (props) => {
    const { onSubmit } = props;
    const [formData, setFormData] = useState<Partial<FormData>>({ ...props?.initValue });
    const [errors, setErrors] = useState<ErrorMessage<FormData>>({});
    const handleValueChange =
        <T extends keyof FormData>(name: T) =>
        (value: FormData[T]) => {
            setFormData({
                ...formData,
                [name]: value,
            });
        };
    const handleSubmit = () => {
        if (!formData.stockCode) {
            setErrors({ stockCode: '編號不可為空' });
            return;
        }
        setErrors({});
        onSubmit &&
            onSubmit({
                stockCode: formData.stockCode,
            });
    };
    return (
        <Grid container spacing={2}>
            <Grid item>
                <TextField
                    size="small"
                    value={formData.stockCode || ''}
                    onChange={(e) => handleValueChange('stockCode')(e.target.value)}
                    error={Boolean(errors.stockCode)}
                    helperText={errors.stockCode}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={handleSubmit}>
                    查詢
                </Button>
            </Grid>
        </Grid>
    );
};
export default StockForm;
