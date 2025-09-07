"use client";

import type { Lead } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Briefcase, Calendar, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadDetailSheetProps {
  lead: Lead;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function LeadDetailSheet({ lead, isOpen, onOpenChange }: LeadDetailSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-card/80 backdrop-blur-xl rounded-l-3xl border-l-0">
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="flex flex-col h-full">
          <SheetHeader className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={lead.avatar} alt={lead.name} />
                <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-2xl">{lead.name}</SheetTitle>
                <SheetDescription>{lead.email}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <Separator />
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>(555) 123-4567</span>
                </div>
              </div>
            </section>
            <Separator />
            <section>
              <h3 className="text-lg font-semibold mb-3">Campaign Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.campaign?.name || 'No Campaign'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Source: {lead.source}</span>
                </div>
              </div>
            </section>
            <Separator />
            <section>
              <h3 className="text-lg font-semibold mb-3">History</h3>
              <div className="relative pl-6">
                  <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-3"></div>
                  <ul className="space-y-6">
                      {(lead.history || [
                        { date: new Date(lead.created_at).toLocaleDateString(), action: 'Created', details: 'Lead was created in the system.' },
                        ...(lead.last_contacted ? [{ date: new Date(lead.last_contacted).toLocaleDateString(), action: 'Contacted', details: 'Last contact made with this lead.' }] : [])
                      ]).map((item, index) => (
                          <li key={index} className="relative">
                              <div className="absolute -left-[27px] top-1 h-5 w-5 bg-primary rounded-full border-4 border-background"></div>
                              <p className="font-semibold">{item.action}</p>
                              <p className="text-sm text-muted-foreground">{item.date}</p>
                              <p className="text-sm mt-1">{item.details}</p>
                          </li>
                      ))}
                  </ul>
              </div>
            </section>
          </div>
          <SheetFooter className="p-6 bg-transparent border-t flex-row justify-end space-x-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact
            </Button>
            <Button className="w-full sm:w-auto">Update Status</Button>
          </SheetFooter>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
