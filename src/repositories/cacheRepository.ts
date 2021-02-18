import Redis from '../services/redis'

const set = (key:string, value:string, seconds:number) => (
    Redis.set(key, value, 'EX', seconds)
)

const exists = (key:string) => Redis.exists(key)

const del = (key:string) => Redis.del(key) 

export default {
    set,
    exists,
    del
}