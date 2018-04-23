import { Directive, ElementRef, Renderer, HostListener } from '@angular/core';

@Directive({
  selector: '[appActivesidebar]'
})
export class ActivesidebarDirective {

    private _isActive = false;

    constructor(private el: ElementRef, private renderer: Renderer) {}

    @HostListener('click', ['$event'])
    onClick(e) {
        e.preventDefault();
        this._isActive = !this._isActive;
        this.renderer.setElementClass(this.el.nativeElement, 'active', this._isActive);
    }

}
