import { Kyc } from "../entities/kyc.entity";
import { User } from "../entities/user.entity";


export interface UserRepository{
create(user:User) : Promise<User>;
findById(id:string): Promise<User | null>;
findByEmail(email:string): Promise<User | null>;
update(user:User): Promise<User>;

saveKyc(kyc:Kyc): Promise<Kyc>;
findKycByUserId(userId:string):Promise<Kyc | null>
updateKycStatus(userId:string, status:Kyc['status'], reviewedBy?:string) : Promise<void>
}