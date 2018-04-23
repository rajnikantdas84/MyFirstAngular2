"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var dropzone_component_1 = require("./dropzone.component");
var dropzone_directive_1 = require("./dropzone.directive");
var dropzone_interfaces_1 = require("./dropzone.interfaces");
exports.DROPZONE_GUARD = new core_1.InjectionToken('DROPZONE_GUARD');
exports.DROPZONE_CONFIG = new core_1.InjectionToken('DROPZONE_CONFIG');
var DropzoneModule = (function () {
    function DropzoneModule(guard) {
    }
    DropzoneModule.forRoot = function (config) {
        return {
            ngModule: DropzoneModule,
            providers: [
                {
                    provide: exports.DROPZONE_GUARD,
                    useFactory: provideForRootGuard,
                    deps: [
                        [
                            dropzone_interfaces_1.DropzoneConfig,
                            new core_1.Optional(),
                            new core_1.SkipSelf()
                        ]
                    ]
                },
                {
                    provide: exports.DROPZONE_CONFIG,
                    useValue: config ? config : {}
                },
                {
                    provide: dropzone_interfaces_1.DropzoneConfig,
                    useFactory: provideDefaultConfig,
                    deps: [
                        exports.DROPZONE_CONFIG
                    ]
                }
            ]
        };
    };
    DropzoneModule.forChild = function () {
        return {
            ngModule: DropzoneModule
        };
    };
    DropzoneModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    declarations: [dropzone_component_1.DropzoneComponent, dropzone_directive_1.DropzoneDirective],
                    exports: [common_1.CommonModule, dropzone_component_1.DropzoneComponent, dropzone_directive_1.DropzoneDirective]
                },] },
    ];
    /** @nocollapse */
    DropzoneModule.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [exports.DROPZONE_GUARD,] },] },
    ]; };
    return DropzoneModule;
}());
exports.DropzoneModule = DropzoneModule;
function provideForRootGuard(config) {
    if (config) {
        throw new Error("\n      Application called DropzoneModule.forRoot() twice.\n      For submodules use DropzoneModule.forChild() instead.\n    ");
    }
    return 'guarded';
}
exports.provideForRootGuard = provideForRootGuard;
function provideDefaultConfig(config) {
    return new dropzone_interfaces_1.DropzoneConfig(config);
}
exports.provideDefaultConfig = provideDefaultConfig;
//# sourceMappingURL=dropzone.module.js.map