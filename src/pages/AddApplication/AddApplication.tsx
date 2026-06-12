import React from 'react';
import { useParams } from 'react-router-dom';
import InternshipForm from '../../components/InternshipForm/InternshipForm';

const AddApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl transition-colors">
        <InternshipForm editId={id} />
      </div>
    </div>
  );
};

export default AddApplication;
