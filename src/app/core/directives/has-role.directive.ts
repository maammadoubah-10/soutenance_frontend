import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({ selector: '[hasRole]' })
export class HasRoleDirective {
  private required: string[] = [];
  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private auth: AuthService
  ) {}

  @Input() set hasRole(roles: string[] | string) {
    this.required = Array.isArray(roles) ? roles : [roles];
    this.update();
  }

  private update() {
    this.vcr.clear();
    if (this.auth.hasRole(...this.required)) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
