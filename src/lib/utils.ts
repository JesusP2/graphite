import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const organizationDomainValidCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789-_';
export const organizationDomainValidCharactersRegex = new RegExp(`^[${organizationDomainValidCharacters}]+$`);

export const notAllowedOrganizationDomains = [
  'create',
  'invite',
  'confirm',
  'search',
];
