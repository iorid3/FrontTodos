import { useState } from 'react';
import { Checkbox, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';

interface TaskProps {
    id: string;
    title: string;
    completion?: boolean;
    onToggle: (id: string, completion: boolean) => Promise<void>;
    className?: string;
  }
  

export default function TaskCard({ id,title,completion,onToggle,className}:TaskProps) {
  const [checked, setChecked] = useState(completion);

  const handleToggle = (event: { target: { checked: any; }; }) => {
    setChecked(event.target.checked);
    onToggle(id,event.target.checked);
  };

  return (
    <Card id ={id} className={className}　sx={{ maxWidth: 345,maxHeight:500}}>
      <CardContent sx ={{display:'flex', flexDirection:'row'}}>
        <Checkbox
          checked={checked}
          onChange={handleToggle}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <div>
        {title}
        </div>
      </CardContent>
    </Card>
  );
}
