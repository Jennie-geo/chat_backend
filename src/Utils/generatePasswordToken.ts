// import { JwtService } from '@nestjs/jwt';
// // import { UserInterface } from 'src/Interface/user.interface';
// import { User } from 'src/user/entities/user.entity';

//export class UtilsConfig {
//   constructor(private jwtService: JwtService) {}
//   async generateToken(user: User) {
//     const payload = { sub: user._id, username: user.email };
//     return {
//       access_token: await this.jwtService.signAsync(payload),
//     };
//   }
//}
