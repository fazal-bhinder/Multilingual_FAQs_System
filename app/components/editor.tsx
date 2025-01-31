import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface Props {
    value: string;
    onChange: (data: string) => void;
}

const Editor = ({ value, onChange }: Props) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            //@ts-ignore
            data={value}  
            onChange={(event: any, editor: ClassicEditor) => {
                const data = editor.getData();
                onChange(data);  
            }}
        />
    );
};

export default Editor;
