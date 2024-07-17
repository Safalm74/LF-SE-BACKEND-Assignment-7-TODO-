import { IRefreshToken } from "../interface/auth";

let refreshTokens:IRefreshToken[]=[];

//function to add token on array (create)
export function createRefreshToken(user_id: string,token:string) {
    refreshTokens.push({
            user_id:user_id,
            token:token
        }
    )
    
    return token;
  }
    

//function to get task on array (create)
export function getTokenByUserId(user_id: string) {
  return refreshTokens.find(({ user_id: userId }) => {
    return userId === user_id;
  });
}
