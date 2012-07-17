package com.spine;

import java.io.File;
import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import java.io.*;

@Path("payments")
public class DocList {
	@GET
    @Produces("application/json; charset=UTF-8")
    public String get() throws IOException {

		String r = getJSON();
		return r;
    }

    private String getJSON() {
    	try {
    	InputStream is =
                this.getClass().getResourceAsStream("/docs.json");

    	Writer writer = new StringWriter();
 
            char[] buffer = new char[1024];
            try {
                Reader reader = new BufferedReader(
                        new InputStreamReader(is, "UTF-8"));
                int n;
                while ((n = reader.read(buffer)) != -1) {
                    writer.write(buffer, 0, n);
                }
            } finally {
                is.close();
            }
            return writer.toString();
        } catch (IOException e) {
        	e.printStackTrace();
        	return "";
        }
	}

	@PUT
	@Path("/{id}")
	@Consumes("application/json; charset=UTF-8")
	public Response put(@PathParam("id") String id, String data) {
		System.out.println(id);
		System.out.println(data);
		return Response.status(400).entity("{\"code\": \"1\", \"message\": \"msg\"}").build();
		//throw new BadRequestException("some message");
	}

	@POST
	@Consumes("application/json; charset=UTF-8")
	@Produces("application/json; charset=UTF-8")
	public Response post(String data) {
		System.out.println("in= " + data);
		String out = data.replace("c-", "01");
		System.out.println("out= " + out);
		return Response.status(201).entity(out).build();

	}

}
