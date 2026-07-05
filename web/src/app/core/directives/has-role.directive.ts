import { Directive, Input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private hasView = false;
  private requiredRoles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService,
  ) {
    effect(() => {
      const currentRoles = this.auth.userRoles();
      this.evaluate(currentRoles);
    });
  }

  @Input() set appHasRole(roles: string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.evaluate(this.auth.userRoles());
  }

  private evaluate(currentRoles: string[]) {
    const hasRole = this.requiredRoles.some((r) => currentRoles.includes(r));

    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
