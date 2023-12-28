import {test, expect} from '@playwright/test'
test.use({ baseURL: 'https://sertis-qa.glitch.me'});

   test("Ensure each valid user id returns complete user details", async({request})=> {
        const response = await request.get(`/user/ids`)        
        let userIds = JSON.parse(await response.text())
        expect(response.status()).toBe(200)
        await Promise.all(userIds.map(async (userId: string) => {
            const response = await request.get(`/user/${userId}`);
            let detail = JSON.parse(await response.text())
            expect(response.status()).toBe(200)
            expect(detail.first_name).toBeDefined()
            expect(detail.last_name).toBeDefined()
            expect(detail.permission).toBeDefined()
            expect(detail.phone_no).toBeDefined()
            expect(detail.otp).toBeDefined()
        }));
    })

    test("Ensure invalid user id returns an error", async({request})=> {
        var userId = "1xx1"
        const response = await request.get(`/user/${userId}`)        
        let detail = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(detail.message).toBe(userId+" is not a valid id")

    })

    test("Ensure each valid user detail is able to signin", async({request})=> {
        const response = await request.get(`/user/ids`)
        let userIds = JSON.parse(await response.text())        
        expect(response.status()).toBe(200)
        await Promise.all(userIds.map(async (userId: string) => {
            const response = await request.get(`/user/${userId}`);
            let detail = JSON.parse(await response.text())  
            const postRes = await request.post('/signin', {
                data:{"phone_no": detail.phone_no, "otp": detail.otp}
            })
            let signInDetail = JSON.parse(await postRes.text())
            expect(postRes.status()).toBe(200)
            expect(signInDetail.status).toBe("Pass")
            expect(signInDetail.message).toBe("Sign in success")
            expect(signInDetail.data.first_name).toBe(detail.first_name)
            expect(signInDetail.data.last_name).toBe(detail.last_name)
            expect(signInDetail.data.permission).toBe(detail.permission)     
        }));
    })

    test("Ensure invalid user detail returns an error", async({request})=> {
            const postRes = await request.post('/signin', {
                data:{"phone_no": "invalidPhone", "otp": "InvalidOtp"}
            })
            let signInDetail = JSON.parse(await postRes.text())
            expect(postRes.status()).toBe(404)   
            expect(signInDetail.status).toBe("Not found")
            expect(signInDetail.message).toBe("User not found")
    })