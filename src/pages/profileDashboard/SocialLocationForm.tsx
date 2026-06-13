import React from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

const SocialLocationForm: React.FC = () => {
  return (
    <Card className="mt-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Social Media</h2>
          <Input placeholder="Twitter" className="mb-3" />
          <Input placeholder="Facebook" className="mb-3" />
          <Input placeholder="Instagram" className="mb-3" />
          <Input placeholder="LinkedIn" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <Input placeholder="Country" className="mb-3" />
          <Input placeholder="City" />
        </div>
      </div>
    </Card>
  );
};

export default SocialLocationForm;
