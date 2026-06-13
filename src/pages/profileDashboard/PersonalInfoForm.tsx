import React from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

const PersonalInfoForm: React.FC = () => {
  return (
    <Card className="mt-6 p-6">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="First Name" />
        <Input placeholder="Last Name" />
        <Input placeholder="Email" />
        <div className="flex gap-2">
          <Input value="+91" className="w-16" readOnly />
          <Input placeholder="Phone Number" />
        </div>
        <Input placeholder="Job Title" />
        <textarea
          placeholder="About"
          maxLength={500}
          className="col-span-full border p-2 rounded resize-none"
          rows={4}
        />
      </div>
    </Card>
  );
};

export default PersonalInfoForm;
