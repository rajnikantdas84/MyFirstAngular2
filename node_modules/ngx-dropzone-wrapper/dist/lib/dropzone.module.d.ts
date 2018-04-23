import { ModuleWithProviders, InjectionToken } from '@angular/core';
import { DropzoneConfig, DropzoneConfigInterface } from './dropzone.interfaces';
export declare const DROPZONE_GUARD: InjectionToken<{}>;
export declare const DROPZONE_CONFIG: InjectionToken<{}>;
export declare class DropzoneModule {
    constructor(guard: any);
    static forRoot(config?: DropzoneConfigInterface): ModuleWithProviders;
    static forChild(): ModuleWithProviders;
}
export declare function provideForRootGuard(config: DropzoneConfig): any;
export declare function provideDefaultConfig(config: DropzoneConfigInterface): DropzoneConfig;
