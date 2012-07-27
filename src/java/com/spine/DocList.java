package com.spine;

import java.io.File;
import java.io.IOException;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;

import java.io.*;
import java.util.logging.*;
//import javax.servlet.*;

//import org.apache.juli.logging.Log;^M
//import org.apache.juli.logging.LogFactory;

@Path("payments")
public class DocList {
    private static Logger myLogger = Logger.getLogger(DocList.class.getName());

    @GET
    @Path("/new")
    @Produces("application/json; charset=UTF-8")
    public String get(@PathParam("id") String id) {
	//myLogger.info("Ah Yeah Baby - that's the end of System.out.println");
	//	ServletContext context = getServletContext();
	// context.log("Hello!");
	//	if (id.matches("-1")) {
	    myLogger.info("id="+id);
	    return "{\"NUM_DOC\":\"1\"}" ;
	    //	} else {
	    //	    String r = getJSON();
	    //	    return r;
	    //	}
    }

    @GET
    @Produces("application/json; charset=UTF-8")
    public String get() {
	//myLogger.info("Ah Yeah Baby - that's the end of System.out.println");
	//	ServletContext context = getServletContext();
	// context.log("Hello!");
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
		//return Response.status(400).entity("{\"code\": \"1\", \"message\": \"msg\"}").build();
		//throw new BadRequestException("some message");
		try {
		Thread.sleep(10000L);
		} catch (Exception e) {}
		return Response.ok().build();
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
