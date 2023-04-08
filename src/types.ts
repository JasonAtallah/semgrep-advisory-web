import type { Module, Version } from '@prisma/client';

export type ModuleWithVersions =
  | (Module & {
      Version: Version[];
    })
  | null;

export type ModuleWithVersionAndCurVersion = ModuleWithVersions & {
  curVersion: Version;
};

export type ModuleWithCurVersion =
  | (Module & {
      curVersion: Version;
    })
  | null;

export type NpmAuditLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type SemgrepLevel = 'Low' | 'Medium' | 'High';
