import React from 'react';
import { Log } from '../types';
import { LogTableRow } from './LogTableRow';
import { SharedTable } from '../../shared/components/SharedTable';

interface LogTableProps {
  logs: Log[];
}

export const LogTable: React.FC<LogTableProps> = ({
  logs,
}) => {
  return (
    <SharedTable
      items={logs}
      renderRow={(log) => (
        <LogTableRow
          key={log.id}
          log={log}
        />
      )}
      header={["Date & Time", "Actor", "Action Performed", "Target Entity", "IP Address"]}
      emptyMessage="No users found matching your filters."
      colSpan={6}
    />
  );
};
