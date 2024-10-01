import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthorizedGuard } from './auth/guards/not-authorized.guard';
import { AuthorizedGuard } from './auth/guards/authorized.guard';
import { AdminGuard } from './user/guards/admin.guard';

export const routes: Routes = [
    /* Add your code here */
    {
        path: 'login',
        loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule),
        canActivate: [NotAuthorizedGuard]
    },
    {
        path: 'registration',
        loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule),
        canActivate: [NotAuthorizedGuard]
    },
    {
        path: 'courses',
        loadChildren: () => import('./features/courses/courses.module').then(m => m.CoursesModule),
        canLoad: [AuthorizedGuard]
    },
    {
        path: 'courses/add',
        loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule),
        canLoad: [AuthorizedGuard],
        canActivate: [AdminGuard]
    },
    {
        path: 'courses/:id',
        loadChildren: () => import('./features/course-info/course-info.module').then(m => m.CourseInfoModule),
        canLoad: [AuthorizedGuard]
    },
    {
        path: 'courses/edit/:id',
        loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule),
        canLoad: [AuthorizedGuard],
        canActivate: [AdminGuard]
    },
    {path: '', redirectTo: '/courses', pathMatch: 'full'},
    {path: '**', redirectTo: '/courses'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}