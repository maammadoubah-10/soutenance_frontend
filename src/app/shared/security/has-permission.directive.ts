import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[hasPermission]' })
export class HasPermissionDirective {
  private required: string[] = [];
  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}

  @Input('hasPermission') set setRequired(value: string | string[]) {
    this.required = Array.isArray(value) ? value : [value];
    this.render();
  }

  private render() {
    this.vcr.clear();
    // permissions déjà stockées par ton AuthentificationService
    let store: string[] = [];
    try { store = JSON.parse(sessionStorage.getItem('permissions') || '[]'); } catch {}
    const set = new Set(store);
    const ok = this.required.every(r => set.has(r));
    if (ok) this.vcr.createEmbeddedView(this.tpl);
  }
}
