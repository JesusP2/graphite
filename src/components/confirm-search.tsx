'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDefaultClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

export function ConfirmRequest() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="w-full">
          Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search organization</DialogTitle>
          <DialogDescription>
            Search for an organization by name
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button
            onClick={() => setIsOpen(false)}
            form="search-org"
            type="submit"
            className="w-20"
          >
            Request
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="secondary">
            Cancel
          </Button>
        </DialogFooter>
        <DialogDefaultClose />
      </DialogContent>
    </Dialog>
  );
}
