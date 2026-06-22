import { ExecutionContext, Injectable,ForbiddenException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserRole } from "../../domain/entities/UserRole.enum";



@Injectable()
export class AdminGuard extends AuthGuard('jwt') {

    override handleRequest (err:any, user:any, info:any, context:ExecutionContext){
          if (err || !user) {
      throw new ForbiddenException('Invalid or missing JWT token');
    }
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
    return user;
    }
    
}